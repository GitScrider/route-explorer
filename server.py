import os
from http.server import HTTPServer, CGIHTTPRequestHandler

os.chdir('.')

server_object = HTTPServer(server_address=(
    '', 8010), RequestHandlerClass=CGIHTTPRequestHandler)
server_object.serve_forever()
