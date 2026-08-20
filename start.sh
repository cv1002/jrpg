#!/bin/bash
# ============================================================
# 勇者传说 · 一键启动（Linux / 通用终端版）
# 用法：./start.sh   （或先 chmod +x start.sh）
# 依赖：python3（系统自带）
# ============================================================
cd "$(dirname "$0")"

PORT="${PORT:-8000}"
URL="http://localhost:$PORT/"

for _ in $(seq 1 20); do
  if ! command -v lsof >/dev/null 2>&1 || ! lsof -ti:"$PORT" >/dev/null 2>&1; then
    break
  fi
  PORT=$((PORT+1))
done
URL="http://localhost:$PORT/"

python3 -m http.server "$PORT" &
SERVER_PID=$!
trap 'kill $SERVER_PID 2>/dev/null' EXIT

sleep 1
echo ""
echo "  🎮 勇者传说 · 已启动：$URL"
echo "     （Ctrl+C 停止服务器）"
echo ""
if command -v open >/dev/null 2>&1; then open "$URL";
elif command -v xdg-open >/dev/null 2>&1; then xdg-open "$URL" >/dev/null 2>&1; fi

wait $SERVER_PID
