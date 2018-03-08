function main(params){
  var date = new Date();
  console.log('Invoked at '+date.toLocaleString());
  return {
    message : 'Invoked at '+date.toLocaleString()
  };
}
