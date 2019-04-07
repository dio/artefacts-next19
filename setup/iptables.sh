#!/bin/bash
set -ex

# Add user
useradd envoy

# Get the user id
export ENVOY_UID=$(id -u envoy)
export ENVOY_INGRESS_PORT=15001
export ENVOY_EGRESS_PORT=15002
export APP_PORTS=8080

# Get boostrap
wget https://gist.githubusercontent.com/dio/613e41cdac168ce10348dcde5e7902b4/raw/2622361fa616995874cc2d8f2672487e3252fc4c/frontend.yaml

curl -sSL https://getenvoy.io/install | sh
/home/diorahman/.getenvoy/bin/getenvoy fetch --user tetrate-internal --password 90b47516f2f78e4f5337800480a3e1e984edb607
cp /home/diorahman/.getenvoy/latest/bin/envoy .

envoy_log="/tmp/envoy.log"
envoy_err="/tmp/envoy.err.log"
if [[ ! -f "$envoy_log" ]]; then
  touch "$envoy_log"
fi
if [[ ! -f "$envoy_err" ]]; then
  touch "$envoy_err"
fi

# Egress traffic from envoy process must be ignored.
if [ -z "${ENVOY_UID}" ]; then
  echo "ENVOY_UID must be set"
  exit 1
fi

if [ -z "${ENVOY_EGRESS_PORT}" ]; then
  echo "ENVOY_EGRESS_PORT must be set"
  exit 1
fi

if [ -z "${ENVOY_INGRESS_PORT}" ]; then
  echo "ENVOY_INGRESS_PORT must be set"
  exit 1
fi

if [ -z "${APP_PORTS}" ]; then
  echo "APP_PORTS must be set"
  exit 1
fi

# Create iptables's chains
iptables -t nat -N TRAFFIC_DIRECTOR_INGRESS
iptables -t nat -N TRAFFIC_DIRECTOR_EGRESS

# Setting egress redirecting

iptables -t nat -A TRAFFIC_DIRECTOR_EGRESS \
  -m owner --uid-owner "${ENVOY_UID}" \
  -j RETURN

# Ignore ssh traffic
iptables -t nat -A TRAFFIC_DIRECTOR_EGRESS \
  -p tcp \
  -m multiport --dports 22 \
  -j RETURN

iptables -t nat -A TRAFFIC_DIRECTOR_EGRESS \
  -p tcp \
  -j REDIRECT --to "${ENVOY_EGRESS_PORT}"

# Apply TRAFFIC_DIRECTOR_EGRESS chain for non local traffic
iptables -t nat -A OUTPUT \
  -p tcp \
  -m addrtype ! --dst-type LOCAL \
  -j TRAFFIC_DIRECTOR_EGRESS


# ingress redirecting

# Ignore non app-ports traffic
iptables -t nat -A TRAFFIC_DIRECTOR_INGRESS \
  -p tcp \
  -m multiport ! --dports "${APP_PORTS}" \
  -j RETURN

# Route all traffic to application ports to envoy's listen port
iptables -t nat -A TRAFFIC_DIRECTOR_INGRESS \
  -p tcp \
  -m multiport --dports "${APP_PORTS}" \
  -j REDIRECT --to-port "${ENVOY_INGRESS_PORT}"

# Apply ingress chain to everything non-local
iptables -t nat -A PREROUTING \
  -p tcp \
  -m addrtype ! --src-type LOCAL \
  -j TRAFFIC_DIRECTOR_INGRESS

su -s /bin/bash -c "exec ./envoy --config-path frontend.yaml --log-level debug \
    2> $envoy_err > $envoy_log < /dev/null &" envoy
