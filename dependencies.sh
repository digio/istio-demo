fetch_package() {
  if ! command -v $1 > /dev/null | brew ls --versions $1 > /dev/null; then
          brew install $1
  else 
          echo " ✅  $1 already installed"
  fi
}

for package in {siege,kubernetes-helm,kubernetes-cli,nginx}; 
do
  fetch_package $package
done