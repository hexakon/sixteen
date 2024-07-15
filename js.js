let reg = [0,0,0,0];
let output = '';

// the function to execute a single operation, obtained from sixteen()
// operation = the operation to execute
// input = user input
async function execute (operation, input) {

	// variables
  let x, y, a, b, reg1, reg2, reg3, num;
	
  // get operation type
	switch (operation.substring(0,2)) {
  	// 11xaaabb - if x=0, read input at pos aaa to reg at pos bb
    //            if x=1, a=000, add reg at bb to output as int
    //                    a=001, add reg at bb to output as unicode
    //                    a=010, print the output var and clear var
    //                    a=011, stop the program
    //                    a=1.., do nothing (go to next op)
  	case '11':
    	x = operation.substring(2,3);
      a = operation.substring(3,6);
      b = operation.substring(6,8);
      // parse binary to decimal
      reg1 = parseInt(b, 2);
      
      if (x === '0') {
      	// parse binary to decimal
      	let inputIndex = parseInt(a, 2);
        reg[reg1] = input.charCodeAt(inputIndex); // set reg to unicode code of the input char
      }
      if (x === '1') {
        if (a==='000')   output += reg[reg1];
        if (a==='001')   output += String.fromCharCode(reg[reg1]);
        if (a==='010') {
            console.log('OUTPUT: '+output);
            document.getElementById('output').innerHTML += "<p>"+output+"</p>"
            output = '';
        }
        if (a==='011')   return 999999999; // skip the entire program
      }
      break;
      
  	// 01xaabbb - if x=0, set reg aa to have value bbb
    //            if x=1, reg aa is 0, skip bbb many ops FORWARDS
    case '01':
    	x = operation.substring(2,3);
      a = operation.substring(3,5);
      b = operation.substring(5,8);
      reg1 = parseInt(a, 2);
      num = parseInt(b, 2);
      if (x === '0') reg[reg1] = num;
      if (x === '1' && reg[reg1] == 0) return num+1; // skip num ops (1-indexed
                                                     // bc why would you skip 0 ops)
      break;
      
    // 10xyaabb - if x=0, y=0, add regs aa and bb, save over aa
    //                    y=1, add to reg aa from immediate bb+1 (why would you add 0)
    // 10xaabbb   if x=1 and reg aa is NOT 0, skip bbb many ops BACKWARDS
    case '10':
    	x = operation.substring(2,3);
      if (x==='0') {
      	y = operation.substring(3,4);
      	reg1 = parseInt(operation.substring(4,6), 2);
        reg2 = parseInt(operation.substring(6,8), 2);
        if (y==='0') reg[reg1] += reg[reg2];
                else reg[reg1] += reg2+1; // why would you add 0
      } else {
      	reg1 = parseInt(operation.substring(3,5), 2);
      	num = parseInt(operation.substring(5,8), 2);
        
      	if (reg[reg1]!==0) return -num-2; // go back num ops (it's -2 bc the
                                          // for-loop +1 when a new cycle starts)
      }
      break;
      
  	// 00xyaabb - if x=0, y=0, subtract regs aa and bb, save over aa
    //                    y=1, subtract from reg aa with immediate bb-1 (see above)
    //            if x=1, y=0, copy aa to bb
    //            if x=1, y=1, move aa to bb (aa set to 0)
  	case '00':
    	x = operation.substring(2,3);
      y = operation.substring(3,4);
      reg1 = parseInt(operation.substring(4,6), 2);
      reg2 = parseInt(operation.substring(6,8), 2);
      if (x==='0' && y==='0') reg[reg1] -= reg[reg2];
      if (x==='0' && y!=='0') reg[reg1] -= reg2+1; // why would you subtract 0
      if (x!=='0' && y==='0') reg[reg2] = reg[reg1];
      if (x!=='0' && y!=='0') { reg[reg2] = reg[reg1]; reg[reg1] = 0; }
      break;
  }
}

// the main function of the interpreter
// program = the program itself, written in Sixteen
// input = user input
async function sixteen (program, input) {
	reg = [0,0,0,0]; // reset reg values
  let ops = []; // list of 8-bit operations
  
  for (let i=0; i < program.length; i++) { // iterate through every character
  	let code = program.charCodeAt(i) // get the character's unicode code
                 .toString(2); // convert to binary
    // if the acquired instruction is less than 16 chars (bits) long
    while (code.length < 16) {
    	code = "0" + code // prepend 0 until it's 16 chars (bits) long
    }
    // separate 16 bits into 8 bits each, then push them as two distinct operations
    ops.push(code.substring(0,8));
    ops.push(code.substring(8));
    /*
    NOTE: There are no unicode characters with code 0-31, meaning an op whose first
    three bits are all 0 cannot be represented by any characters. By having one char
    represent two ops, the first of the two ops can simply do nothing (11111111),
    and the second op can take any action free of input limitations.
    */
  }
  
  // iterate through and execute every operation in order
  for (let i=0; i < ops.length; i++) {
  	let res = await execute(ops[i], input);
    //console.log('executed op '+i+': '+ops[i]+' (current regs: '+reg+')');
    if (!isNaN(res)) { // if the return value is a number, then it's a skip
    	i += res; // move steps accordingly
      //console.log('skipping '+res+' ops...');
      //await new Promise(j => setTimeout(j, 200)); // a pause so i can actually read the damn console
    }
  }
  
  console.log(reg);
  return;
}

// an alternative interpreter that further compacts the program by 20%
async function twenty (program, input) {
	reg = [0,0,0,0]; // reset reg values
  let ops = ''; // list of operations
  
  for (let i=0; i < program.length; i++) { // iterate through every character
  	// eliminate lower surrogate if it's a surrogate pair
    if (program.codePointAt(i-1) !== undefined && program.codePointAt(i-1) > 65535) continue;
    
  	let code = program.codePointAt(i)
                 .toString(2);
                 //console.log(program.codePointAt(i) + " = " + code)
    // twenty characters have 20 bits instead of 16
    while (code.length < 20) {
    	code = "0" + code;
    }
    //console.log(program[i] + " = " + code)
    
    ops += code;
  }
  // separate into an array of 8 characters each
  ops = ops.match(/.{1,8}/g);
  
  //console.log(ops);
  
  // iterate through and execute every operation in order
  for (let i=0; i < ops.length; i++) {
  	let res = await execute(ops[i], input);
    console.log('executed op '+i+': '+ops[i]+' (current regs: '+reg+')');
    if (!isNaN(res)) { // if the return value is a number, then it's a skip
    	i += res; // move steps accordingly
      console.log('skipping '+res+' ops...');
      await new Promise(j => setTimeout(j, 1000)); // a pause so i can actually read the damn console
    }
  }
  
  console.log(reg);
  return;
}

(function() {
	console.log("sixteen is running")
})();