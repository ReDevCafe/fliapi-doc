# Mod base <Badge type="warning" text="^1.00" />

::: tip
Note that, unless you are using offsets specific to the game or the mod loader undergoes a major code change, you useually **do not** need to update your code, it will remain compatible with newer versions ❤️
:::

`ModBase` is the main class of your mod. It's the blueprint of your mod. It comes with three **extremely important virtual functions**..

###### void OnPreLoad()
  This function is called at the start, when your mod is found and the mod loader is attempting to execute it.

###### void OnPostLoad()
  This function is called when the game is loading your save for the first time. Certain things, like the player level, might need to be initialized here.

###### void OnExit() <Badge type="warning" text="^RC1.10" />
  One of the most important functions, used to avoid memory leaks and saving things. In this function **PLEASE** make sure to **close threads** or **free any allocated memory**

### How it is represented inside Mod.cpp

First, create your main class that extends `ModBase`:
```cpp
class YourModClass : public ModBase
```

Here's a example of what your code should look like:
x
```cpp
#include "MDK.h"

class YourModClass : public ModBase
{

  Logger* logger;

  public:
  // Initialize things
  void OnPreLoad() override 
  {
    logger = new Logger("YourModID");
    logger->info("Helloooooo from OnPreLoad");
  }

  void OnPreLoad() override 
  {
    logger->info("Helloooooo from OnPostLoad");
  }

  // Free ressources
  void OnExit() override 
  {
    logger->info("Seeeyaaa");
    delete logger;
  }
};
```

### Allow the mod loader to find your main mod class

At the end of your code, add this:
```cpp
MOD_EXPORT ModBase* CraftMod() { return new YourModClass(); }
```

Like this:

```cpp
class YourModClass : public ModBase
{
  ...
};

MOD_EXPORT ModBase* CraftMod() { return new YourModClass(); };
```

### References
- [Mod Base](https://github.com/ReDevCafe/FantasyLifeI-ModLoader-Headers/blob/main/Mod/ModBase.hpp)
- [Mod.cpp](https://github.com/ReDevCafe/FantasyLifeI-ModTemplate/blob/master/src/Mod.cpp)