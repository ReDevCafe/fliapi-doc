# Recreating engine function with `GameFunctionProxy<T>` <Badge type="warning" text="^RC1.10" />
Game Function Proxies are a clean and reusable way to interface with native game functions discovered trough rever engineering.
They encapsulate pattern scanning, address resolution and call safety into a simple C++ class based wrapper.

The [GameFunctionProxy](https://github.com/ReDevCafe/FantasyLifeI-ModLoader-Headers/tree/main/API/GameFunctionProxy.hpp) base class is provided as part of the **FLiAPI** and allows your mod to safely call internal game functions by signature.

Here's a simple example of a use case:

`FNameToString.hpp`
```cpp
// Defines the native function signature as seen in disassembly (RCX = thisptr, RDX = FString*)
typedef void (__fastcall *FLIAPI_DEF_FNameToString)(FName* thisptr, FString* a2);

// Wrapper for the internal FName::ToString() engine function
class FNameToString : public GameFunctionProxy<FLIAPI_DEF_FNameToString>
{
  private:

  /***
   * Function pattern (unique byte signature used to locate the function in memory)
   * Wildcards (??) mark bytes that may vary between builds.
   */
  static constexpr uint8_t pattern[] = 
  {
    0x48, 0x89, 0x5C, 0x24, 0x10, 0x48, 0x89, 0x74, 0x24, 0x18, 0x57, 0x48, 0x83, 0xEC, 0x20, 0x80,
    0x3D, 0x38, 0x54, 0x2E, 0x09, 0x00, 0x48, 0x8B, 0xFA, 0x8B, 0x19, 0x48, 0x8B, 0xF1, 0x74, 0x09,
    0x48, 0x8D, 0x15, 0x59, 0x17, 0x31, 0x09, 0xEB, 0x16, 0x48, 0x8D, 0x0D, 0x50, 0x17, 0x31, 0x09,
    0xE8, 0x5B, 0x19, 0xFE, 0xFF, 0x48, 0x8B, 0xD0, 0xC6, 0x05, 0x0F, 0x54, 0x2E, 0x09, 0x01, 0x8B,
    0xCB, 0x0F, 0xB7, 0xC3, 0xC1, 0xE9, 0x10, 0x89, 0x4C, 0x24, 0x30, 0x89, 0x44, 0x24, 0x34, 0x48,
  };
  
  FNameToString() :
  GameFunctionProxy<FLIAPI_DEF_FNameToString>(
      "FName::ToString()",                               // Unique function identifier (for logging)
      const_cast<uint8_t*>(pattern),                     // Byte pattern
      "xxxxxxxxxxxxxxxxx????xxxxxxxxxxxxxxx???xxxxxx??????xxxxxxx????xxxxxxxxxxxxxxxxxx", // Mask
      0                                                  // Offset fallback (unused, unsafe)
    )
  {}

  public:
  FLIAPI_FUNCTION_INSTANCE_MACRO(FNameToString);         // Creates static instance()
  FLIAPI_FUNCTION_CALL_MACRO(FLIAPI_DEF_FNameToString);  // Creates static call(...) wrapper
};
```


`Mod.cpp`
```cpp
void YourMod::OnPreLoad()
{
  ...

  FName test = gameCache->GetItem("imt01004480").getObject().nameId;  // Get item name ID (FName)
  FString fstrtest;                                                   // Buffer to receive string result
  FNameToString::call(&test, &fstrtest);                              // Call native FName::ToString()

  ...
}
```

### What is a GameFunctionProxy?
A GameFunctionProxy is a small helper class that defines how to locate and call an internal engine / game function, it contains:
- `id`: A unique identifier used for logging and debugging when the function fails to load.
- `pattern`: A byte signature used to locate the function inside the game’s binary.
- `mask`: A wildcard string that marks which bytes in the pattern should be ignored (?).
- <Badge type="warning" text="Optional" /> `offset`: A fallback address offset, used only if the pattern scan fails.

The first time you call a GameFunctionProxy function, the proxy automatically scans the game's memory to resolve the function's address.
Once found, it lets you call the gamr function directly as if it were a regular C++ method.

### Defining a pattern when reversing

When reverse-engineering a function, you can extract it's machine code byte and build a pattern.
Patterns are used to identify the function inside the game's loaded image, even if it's reloacted in memory.

###### Example pattern
```ruby
4C 8B DC 48 83 EC 78 48 8B 05 ?? ?? ?? ?? 48 85
C0 0F 85 92 00 00 00 48 8D 05 ?? ?? FF FF 49 89
43 08 4C 8D 0D ?? ?? ?? FF 48 8D 05 B0 DE 00 00
```

Each pair of hexadecimal numbers represents one byte.
Wildcards (`??`) mark bytes that may vary between versions (for example, relative jump offsets or addresses).

### The mask
The mask string is a simple way to tell which bytes mst be matched (`x`) and which can be ignored (`?`)
By example:

```bash
xxxxxxxxxxxxxxxxx????xxxxxxxxxxxxxxx???xxxxxx??????xxxxxxx????xxxxxxxxxxxxxxxxxx
```

Each character corresponds to one byte in the patern:
- `'x'`: match this byte exactly.
- `'?'`: ignore this byte (`wildcard`).

### Understanding offsets
The `offset` arguments in `GameFunctionProxy` is a fallback mechanism used only when pattern scanning fails.
If the pattern cannot be found in the game image, the proxy logs a warning and attempts to resolve the function by `baseAddress + offset`

::: warning
Offsets are unsafe and version-dependent.
Use them only during testing or when no reliable pattern is available.
:::

### Creating your own proxy
To define you own function proxy, inherit from `GameFunctionType<YourType>` and specify the pattern, mask, and offset (optional).

Example:
###### Define your type
```cpp
typedef void (__fastcall *YourType)(FName* thisptr, FString* a2);
```

###### Create your class
```cpp
class YourFunctionClass : public GameFunctionProxy<YourType>
{
  ...
}
```

##### Extract pattern from the dissassembled targeted function
```cpp
static constexpr uint8_t pattern[] = {
    0x48, 0x89, 0x5C, 0x24, 0x10, 0x48, 0x89, 0x74, 0x24, 0x18, 0x57, 0x48, 0x83, 0xEC, 0x20, 0x80,
    0x3D, 0x38, 0x54, 0x2E, 0x09, 0x00, 0x48, 0x8B, 0xFA, 0x8B, 0x19, 0x48, 0x8B, 0xF1, 0x74, 0x09,
    0x48, 0x8D, 0x15, 0x59, 0x17, 0x31, 0x09, 0xEB, 0x16, 0x48, 0x8D, 0x0D, 0x50, 0x17, 0x31, 0x09,
    0xE8, 0x5B, 0x19, 0xFE, 0xFF, 0x48, 0x8B, 0xD0, 0xC6, 0x05, 0x0F, 0x54, 0x2E, 0x09, 0x01, 0x8B,
    0xCB, 0x0F, 0xB7, 0xC3, 0xC1, 0xE9, 0x10, 0x89, 0x4C, 0x24, 0x30, 0x89, 0x44, 0x24, 0x34, 0x48,
  };
```

##### Create the constructor
```cpp
YourFunctionClass()
: GameFunctionProxy<YourType>
(
  // Id
  "YourFunctionClass::YourFunctionName()",

  // Pattern
  const_cast<uint8_t*>(pattern),

  // Mask
  "xxxxxxxxxxxxxxxxx????xxxxxxxxxxxxxxx???xxxxxx??????xxxxxxx????xxxxxxxxxxxxxxxxxx",

  // Offset
  0,
){}
```

##### And add the extremly important magic function (trust me bro)
```cpp
public:
FLIAPI_FUNCTION_INSTANCE_MACRO(YourFunctionClass);
FLIAPI_FUNCTION_CALL_MACRO(YourType);
```

### Calling your recreated function
After defining the proxy, you can call it anywhere in your mod:
```cpp
YourFunctionClass::call(&a &b);
logger->info(b.ToString);
```

### Internal proccess:
What is happenning when your proxy is instantiated?
1. The base address of the game is retrived via `GameData::getBaseAddress()`
2. The `Pattern` scanner searches the image for a matching byte sequence
3. If a match is found, the address is stored as a valid function pointer.
4. If not found, a warning is logged and the `offset` fallback is used.

::: tip NOTE
if `_function` remain null, any attempt to call it throws a `std::runtime_error`, ensuring you never execute an invalid address
:::


### References
- [GameFunctionProxy](https://github.com/ReDevCafe/FantasyLifeI-ModLoader-Headers/tree/main/API/GameFunctionProxy.hpp)
- [Pattern](https://github.com/ReDevCafe/FantasyLifeI-ModLoader-Headers/tree/main/Hook/Pattern.hpp)