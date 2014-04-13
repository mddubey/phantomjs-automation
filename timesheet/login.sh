read -r -p "User Name: " userName

echo -n Password:
read -s password
echo

phantomjs login.js $userName $password

