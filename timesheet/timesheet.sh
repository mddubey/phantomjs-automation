read -r -p "User Name: " userName

echo -n Password:
read -s password
echo

echo "Signing in As $userName"
phantomjs timesheet.js $userName $password

