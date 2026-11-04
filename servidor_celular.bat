@echo off
title Servidor Local para Celular - Aventura en Medellin
echo ===================================================================
echo     SERVIDOR LOCAL PARA JUGAR EN CELULAR / TABLET (MISMO WI-FI)
echo ===================================================================
echo.
echo Direccion IP de tu computador:
ipconfig | findstr /i "IPv4"
echo.
echo INSTRUCCIONES PARA CELULAR:
echo 1. Asegurate de que tu celular este conectado a la misma red Wi-Fi.
echo 2. Abre el navegador de tu celular (Chrome o Safari).
echo 3. Escribe la IP que aparece arriba seguida de :8000
echo    (Por ejemplo: http://192.168.1.15:8000)
echo.
echo Presiona Ctrl+C en esta ventana para detener el servidor cuando termines.
echo ===================================================================
echo.
python -c "import http.server, socketserver; h = type('NoCache', (http.server.SimpleHTTPRequestHandler,), {'end_headers': lambda s: (s.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0'), http.server.SimpleHTTPRequestHandler.end_headers(s))}); socketserver.TCPServer(('', 8000), h).serve_forever()"
