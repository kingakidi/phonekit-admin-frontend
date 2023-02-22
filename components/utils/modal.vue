<template>
  <div>
    <button @click="showModal">click me</button>
    <div
      class="h-full w-full flex justify-center items-center z-50 bg-transparent absolute top-0 left-0"
    >
      <div
        class="lg:w-2/5 h-1/2 shadow-md border-r-2 p-5 bg-slate-50 sm:w-3/4 border-sky-500"
      >
        <div class="flex justify-end items-end mb-4">
          <button
            class="px-4 py-2 rounded border-gray-100 bg-sky-500 text-white self-end"
            @click="showModal"
          >
            Close
          </button>
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
props: {
  show: showModal;
}

console.log(props.show);
const isVisibleModal = ref(false);

const showModal = () => {
  isVisibleModal.value = !isVisibleModal.value;
};
</script>
