#!/bin/bash
# ============================================================
# 勇者传说 · 一键启动（macOS 双击本文件即可运行）
# 依赖：系统自带 python3（无需安装任何东西）
# 说明：ES Modules 需要 http 服务器，本脚本自动起本地服务器并打开浏览器。
# ============================================================
cd "$(dirname "$0")"

PORT="${PORT:-8000}"
URL="http://localhost:$PORT/"

# 端口被占用则自动顺延（最多试 20 个）
for _ in $(seq 1 20); do
  if ! lsof -ti:"$PORT" >/dev/null 2>&1; then
    break
  fi
  PORT=$((PORT+1))
done
URL="http://localhost:$PORT/"

python3 -m http.server "$PORT" >/dev/null 2>&1 &
SERVER_PID=$!
trap 'kill $SERVER_PID 2>/dev/null' EXIT

sleep 1
open "$URL" 2>/dev/null

echo ""
echo "  🎮 勇者传说 · 已启动：$URL"
echo "     请在弹出的浏览器窗口中开始冒险！"
echo "     （本窗口用于保持服务器运行，关闭窗口或按 Ctrl+C 即停止）"
echo ""
wait $SERVER_PID
