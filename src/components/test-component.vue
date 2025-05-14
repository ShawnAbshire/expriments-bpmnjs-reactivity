<template>
  <div class="flex gap-x-10 absolute left-10 bottom-32">
    <input class="border rounded p-2" v-model="name" />
    <input class="border rounded p-2" v-model="other" />
  </div>

  <button class="absolute left-10 bottom-8 z-10 px-5 py-2 bg-red-100" @click="$emit('exportModel')">Export</button>

  <div class="flex flex-row gap-x-10 absolute z-10 bottom-20 left-10 ">
    <div class="bg-blue-100 px-5 py-2">propertyValue: {{ name }}</div>
    <div class="bg-blue-500 px-5 py-2">propertyValue: {{ other }}</div>
  </div>
</template>

<script lang='ts' setup>
import { useReactiveEventProperty } from '../composable/reactive';

interface Props {
  modeler: any;
}

const props = defineProps<Props>();
defineEmits(['exportModel']);

const { valueRef: name } = useReactiveEventProperty(props.modeler, 'Activity_0bry28l', 'name');
const { valueRef: other } = useReactiveEventProperty(props.modeler, 'Activity_0bry28l', 'other');
</script>
