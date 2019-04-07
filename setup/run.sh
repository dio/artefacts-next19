#!/usr/bin/env bash
#
# Script to configure and start Envoy on GCE VM to enable GCP Traffic Director.
#
# Usage:
#   sudo ./run.sh
#
# The Envoy process will be started in the background. Only one Envoy process
# can be run at any given time; before restarting, please kill any existing
# Envoy process.
#
# Assumptions:
#   Username for running Envoy needs to be filled in "sidecar.env" before
#   evoking this script.
#   Root privilege is required to run this script.
#   Envoy is assumed to be always evoked by the same user.
#
# Input:
#   A tarball named "traffic_director.tar.gz" is located in the same directory
# and contains Envoy binary, Envoy bootstrap template, and iptables script.
#   A config file named "sidecar.env" is located in the same directory and with
# Envoy user specified.
#
# Output:
#   This script will create a directory named "traffic_director" with files
# extracted from traffic_director.tar.gz, alone with instantiated bootstrap and
# iptables script output.
#   Two log files will be created/overwritten in Envoy log directory.

set -o errexit
set -o nounset
set -o pipefail

# Files.
package_directory=$(dirname "$0")
config_file="${package_directory}/sidecar.env"
release_directory="$package_directory/traffic_director"
iptables_script="${release_directory}/iptables.sh"
iptables_out="${release_directory}/iptables.out"
envoy_binary="~/.getenvoy/latest/bin/envoy"
bootstrap_template="${release_directory}/bootstrap_template.yaml"
bootstrap_instance="${release_directory}/bootstrap_instance.yaml"


# This script needs to run as root because iptables needs root access.
if [[ "$EUID" -ne 0 ]]; then
  echo "$0 must run as root" >&2
  exit 1
fi

# Restart cleanly.
if [[ -d "$release_directory" ]]; then
  rm -rf "$release_directory"
fi
mkdir "$release_directory"

# Load and check environment variables.
echo -n "Loading environment variables... "
if [[ -r "$config_file" ]]; then
  source "$config_file"
else
  echo "Cannot read config file: $config_file" >&2
  exit 1
fi

if [[ -z "$ENVOY_USER" ]]; then
  echo "The user to run Envoy is not explicitly set." >&2
  echo "Please fill in username in \"${config_file}\"" >&2
  exit 1
fi

if [[ ! -d "$LOG_DIR" ]]; then
  mkdir -p "$LOG_DIR"
fi

if [[ ! -f "$XDS_SERVER_CERT" ]]; then
  echo "Public server certificate does not exist: $XDS_SERVER_CERT" >&2
  exit 1
fi
echo " done."

# Query the instance metadata server to find the zone Envoy is running in. The
# response is in the format: projects/[NUMERIC_PROJECT_ID]/zones/[ZONE] so we
# must parse the zone out via cut.
envoy_zone="$(curl \
  "http://metadata.google.internal/computeMetadata/v1/instance/zone"\
  -H "Metadata-Flavor: Google" \
  --silent \
  --show-error \
  | cut -d'/' -f4 || echo "")"
if [[ -z "$envoy_zone" ]]; then
  echo "Error fetching zone from GCP metadata server. Bootstrap zone will be \
left empty." >&2
fi

# Just in case, see https://github.com/envoyproxy/envoy/issues/2106
envoy_shared_memory='/dev/shm/envoy_shared_memory_0'
if [[ -f "$envoy_shared_memory"  ]]; then
  envoy_shared_memory_owner=$(ls -ld "$envoy_shared_memory" | awk '{print $3}')
  if [[ "$envoy_shared_memory_owner" != "$ENVOY_USER" ]]; then
    echo "File $envoy_shared_memory for Envoy shared memory region \
/envoy_shared_memory_0 is not owned by user $ENVOY_USER" >&2
    echo "Consider deleting file $envoy_shared_memory and restart." >&2
    echo "More info: https://github.com/envoyproxy/envoy/issues/2106" >&2
    exit 1
  fi
fi

# Run iptables.sh.
echo -n "Running iptables script... "
chmod +x "$iptables_script"
envoy_user_id=$(id -u "$ENVOY_USER")
"$iptables_script" -i "$SERVICE_CIDR" -u "$envoy_user_id" -p "$ENVOY_PORT"
echo " done."

# Instantiate bootstrap template.
# Set Envoy node ID to a random number for debugging purposes.
envoy_node_id="$RANDOM""$RANDOM""$RANDOM"
envoy_admin_port=$((${ENVOY_PORT} - 1))
echo -n "Generating Envoy bootstrap... "
cat "$bootstrap_template" \
    | sed -e "s|ENVOY_NODE_ID|${envoy_node_id}|g" \
    | sed -e "s|ENVOY_ADMIN_PORT|${envoy_admin_port}|g" \
    | sed -e "s|ENVOY_PORT|${ENVOY_PORT}|g" \
    | sed -e "s|XDS_SERVER_CERT|${XDS_SERVER_CERT}|g" \
    | sed -e "s|ENVOY_ZONE|${envoy_zone}|g" \
    > "$bootstrap_instance"
echo " done."

# Create necessary log files for Envoy
envoy_log="${LOG_DIR}envoy.log"
envoy_err="${LOG_DIR}envoy.err.log"
if [[ ! -f "$envoy_log" ]]; then
  touch "$envoy_log"
fi
if [[ ! -f "$envoy_err" ]]; then
  touch "$envoy_err"
fi

# Grant permission to Envoy user and others.
chown "$ENVOY_USER": "$envoy_binary"
chown "$ENVOY_USER": "$bootstrap_instance"
chown "$ENVOY_USER": "$envoy_log"
chown "$ENVOY_USER": "$envoy_err"
chmod o+rx "$envoy_binary"
chmod o+r  "$bootstrap_instance"
chmod o+rw "$envoy_log"
chmod o+rw "$envoy_err"

# Temporary check: if there is an Envoy process running, the subsequent
# evocations would fail to launch new processes, therefore; if the number of
# processes containing the word "envoy" does not change, it might be an
# indication that there was an Envoy running.
num_envoy_processes() {
  echo "$((ps -u "$ENVOY_USER" || true ) | (grep 'envoy' || true) | wc -l)"
}

num_processes_before=$(num_envoy_processes)

# Start Envoy.
echo -n "Starting Envoy (Envoy ID: ${envoy_node_id})..."
su -s /bin/bash -c "exec $envoy_binary \
    --config-path $bootstrap_instance --log-level $LOG_LEVEL \
    2> $envoy_err > $envoy_log < /dev/null &" "$ENVOY_USER"

sleep 2  # Wait for Envoy to start to avoid false positive.
num_processes_after=$(num_envoy_processes)
if [[ "$num_processes_before" -eq "$num_processes_after" ]]; then
  echo
  echo "WARNING: Envoy might have failed to start due to an existing Envoy \
process. If so, please kill the previous Envoy instances and restart." >&2
  ps -u "$ENVOY_USER" | grep 'envoy' | cat >&2
  exit 2
fi
echo " done."