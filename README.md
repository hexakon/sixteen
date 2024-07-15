# sixteen

An extremely dense esolang I made for school in 2021, uploaded here for housekeeping.

The language works by storing instructions inside unicode characters, which can carry up to 21 bits of data (U+10FFFF). `sixteen` uses 16 bits from each character to represent two instructions of 8 bits each.

Alternatively, the sister language `twenty` uses 20 bits from each character to represent two-and-a-half instructions, allowing for even denser code.

I am aware the code is garbage, but so was this entire idea.

## How to code 

> [!NOTE]  
> `sixteen` and `twenty` function identically. Both have:
> 
> - 4 registers (of javascript type `Number`), initialized with value 0.
> - 8-bit instructions
> - support for up to 8 unicode characters as program input.

Here's how to write code for them:

1. Begin by writing your program in binary according to the instructions below. Make it one long row of numbers.
2. Split the line of numbers in intervals of 16 digits (for `sixteen`) or 20 digits (for `twenty`).
3. Head to https://unicodelookup.com/ and search for the corresponding unicode characters. Write them down in a list.
4. The resulting string of unicode characters is your code! Run it by opening the HTML file in this repo, paste in the code, and press "run sixteen" or "run twenty" accordingly.

## Instructions

Here are all the possible instructions (`x` means that bit is ignored):

### Input
- `110aaabb` = read the character at input position `aaa` into register `bb`.

### Output
- `111000bb` = take the value of reg `bb`, and adds it to the output buffer as a **number**.
- `111001bb` = take the value of reg `bb`, and adds it to the output buffer as a **unicode character**.
- `111010xx` = output the buffer on a new line, and empty the buffer.

### Arithmetic
- `010bbaaa` = **set** reg `bb` to have the value `aaa`.
- `1000bbcc` = **add** regs `bb` and `cc`, and save the sum in reg `bb`.
- `0000bbcc` = **subtract** reg `bb` with reg `cc`, and save the difference in reg `bb`.
- `1001bbaa` = **add** reg `bb` with the number `aa`+1, and save the sum in reg `bb`.
- `0001bbaa` = **subtract** reg `bb` with the number `aa`+1, and save the difference in reg `bb`.

### Logic
- `011bbaaa` = if reg `bb`'s value is 0, jump **forward** `aaa`+1 instructions.
  - Example: If this is instruction 7, the condition is met, and `aaa` = `000`, the program will point to instruction 9.
- `101bbaaa` = if reg `bb`'s value is **not** 0, jump **backward** `aaa`+1 instructions.
  - Example: If this is instruction 5, the condition is met, and `aaa` = `001`, the program will point to instruction 3.
  
### Copy and move
- `0010bbcc` = **copy** the value of reg `bb` to reg `cc`.
- `0011bbcc` = **move** the value of reg `bb` to reg `cc`, and set reg `bb`'s value to 0.

### Miscellaneous
- `111011xx` = stop the program no matter what.
- `1111xxxx` = do nothing. (go to next instruction)

> [!IMPORTANT]  
> Sometimes the "do nothing" instruction will be necessary, because unicode doesn't actually have characters for every code point, and some are control characters that cannot be easily copy-pasted. It's also why there exists a sublanguage for 2.5 instructions per character, but not for 1 per character.

# Example programs

Factorial calculator in `sixteen` (input must be two digits, such as `05` or `19`)
```
鎓隖ᐢ舔ꥐ윌숈鞗锔躩ﱙⰜㄮ腲ᢲ뻿
```

Factorial calculator in `twenty` (input must be two digits and not `00`)
```
򓤹񩘔𢠡񊧇찠򉞗򕅈󪤬𜌒󨅲𘬫󮃨
```

# Contributing

Sure, why not.