REMOTE_PORT=41373
LOCAL_PORT=9080

echo "Forwarding port itmo:$REMOTE_PORT to localhost:$LOCAL_PORT"
ssh -L $LOCAL_PORT:localhost:$REMOTE_PORT itmo