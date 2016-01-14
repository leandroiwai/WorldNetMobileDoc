if [ -d "templates/$1/images" ]; then
 rm -vrf "assets/images/*"
 cp -vR "templates/$1/images" "assets/";
else
  echo "wrong template specified, available tamplates:" & ls "templates";
fi
