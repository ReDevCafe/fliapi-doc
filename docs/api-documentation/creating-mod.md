# Creating mods

Creating mods has been made easier with a [template](https://github.com/ReDevCafe/FantasyLifeI-ModTemplate) on our github.

You can also clone it with:
```bash
$ git clone --recurse-submodules https://github.com/ReDevCafe/FantasyLifeI-ModTemplate YOUR_MOD_NAME
$ cd YOUR_MOD_NAME
```

### Configure your mod
In your repository you will find two important files:
- `resource/Mod.json`
- `CMakeLists.txt`

##### 1. Configure your CMake project

  There are two things you need to modify in `CMakeLists.txt`.

  The project name (replace `"FliMod"` with your mod's name) 
  ```cmake
  project(FLiMod LANGUAGES CXX C)
  ```

  And the ModLoader library version, you can find all versions [here](https://github.com/ReDevCafe/FantasyLifeI-API/releases):
  ```cmake
  set(MODLOADER_BUILD_VERSION "v20250915.2026")
  ```

  ::: tip
  If you want to use a custom build, you can comment out these lines:

  ```cmake
  #file(DOWNLOAD ${MODLOADER_URL} ${MODLOADER_LIB_PATH} SHOW_PROGRESS STATUS DOWNLOAD_STATUS)

  #list(GET DOWNLOAD_STATUS 0 DOWNLOAD_RESULT)
  #if(NOT DOWNLOAD_RESULT EQUAL 0)
  #    message(FATAL_ERROR "Failed to download ModLoader.lib (status ${DOWNLOAD_RESULT})")
  #endif()
  ```

  Then place your own `ModLoader.lib` inside the `lib` folder.
  :::

##### 2. Configure you Mod metadata
  
  ::: tip
  The metadata file is located at `resource/Mod.json`
  :::

  a sample `Mod.json`:
  ```json
  {
    "title": "My Mod",
    "identifier": "mymod",
    "author": "Me",
    "version": 1.0,
    "dependencies": {
        "fliapi": 1.0
    }
  }
  ```

  Explanation of each field:
  - `title`: The name of your mod, can contain spaces, number, ect.. Useful for displaying in a mod menu.
  - `identifier`: A unique ID for your mod, used by other mods to define dependencies.
  - `author`: Your display name.
  - `version`: The version of your, useful for dependecy management.
  - `dependencies`: A list of dependencies, each entry has a `key` **(the mod ID of the required mod)** and a `value` **(the minimum version required)**

### Build and Package Your Mod
Once your files are configured, you can build the mod.

###### 1. Use CMake to configure and generate project files
```bash
$ mkdir build
$ cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
```

###### 2. Build your project
```bash
$ cmake --build build --config Release --target package_mod
```

::: tip
After building, your mod archive can be found at `build/packages/*.fliarchive`
:::

### References:
- [Mod Template](https://github.com/ReDevCafe/FantasyLifeI-ModTemplate)
- [CMakeLists](https://github.com/ReDevCafe/FantasyLifeI-ModTemplate/blob/master/CMakeLists.txt)
- [Mod Meta](https://github.com/ReDevCafe/FantasyLifeI-ModTemplate/blob/master/resource/Mod.json)