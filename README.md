# aioli

This is a drawer/bottom-sheet library based on [radix-vue](https://github.com/radix-vue/radix-vue). It is **heavily** inspired by [Vaul](https://github.com/emilkowalski/vaul) and pretty much a Vue port of it.

## Installation

```bash
pnpm add aioli

npm install aioli

yarn add aioli
```

## Usage

```vue
<script setup>
import { DialogRoot, DialogTrigger, DialogPortal, DialogOverlay, DialogContent } from 'aioli';
</script>

<template>
<DialogRoot>
  <DialogTrigger>Open</DialogTrigger>
  <DialogPortal>
    <DialogContent>
      Content
    </DialogContent>
    <DialogOverlay />
  </DialogPortal>
</DialogRoot>
</template>
```

## Credits

- [Vaul](https://github.com/emilkowalski/vaul) for the awesome drawer idea/implementation ❤️
- [radix-vue](https://github.com/radix-vue/radix-vue) for the Radix UI port
- [VueUse](https://github.com/vueuse/vueuse) 


## Why the name?

Originally I wanted to name it something along the lines of `vaul-vue` but while porting Vaul I realized that I wanted to make some changes to the Implementation and API. Naming it `vaul-vue` seemed a bit misleading then.

So I decided to name it something else. I couldn't think of anything for a while. Ultimately some friends suggested Aioli and I just went with it.
