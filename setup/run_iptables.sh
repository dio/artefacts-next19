#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

config_file="./sidecar.env"
iptables_script="./iptables.sh"

# Source env
source "$config_file"

# Run iptables.sh.
echo -n "Running iptables script... "
chmod +x "$iptables_script"
ENVOY_UID=$(id -u "$ENVOY_USER") "$iptables_script"
echo " done."
