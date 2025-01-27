# Gerdau

# . env backed example

user=sa
password=Password123@jkl#
server=localhost
database=gerdau
generateTables=false
DB_PORT=1433
PORT=4000
keyUrl=./keys/localhost-key.pem
certUrl=./keys/localhost.key

inCharge=Encargado
approve=Aprobada
reject=Rechazada
requested=Solicitada

urlCause=http://localhost:3000/cause/detail/
pendind=pendiente
cause=Causa

urlSolution=http://localhost:3000/solution/detail/
solution=Solucion

urlFault=http://localhost:3000/fault/detail/
progress=En progreso
fault=Falla

FORGOT_PASSWORD_URL=http://localhost:3000/reset?t=${token}
REGISTER_URL=http://localhost:3000/reset?t=${token}&isNewUser=true