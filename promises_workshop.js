let promiseFuction = () => {
  return new Promise(function(resolve, reject) {
	let counter = 1
	let timer = setInterval(function(){ 
		console.log("counter is now "+counter);
		counter++;
		if(counter>5) {
			clearInterval(timer);
			resolve(counter);
		}
	}, 1000);
  });
};

let testProimse = promiseFuction();
testProimse.then(function(value) {
  console.log("Value when promise is resolved : ", value);
});


