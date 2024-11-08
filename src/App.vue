<template>
  <div id="canvas" ref="wrapper" class="w-[75%] h-full "> </div>
  <div id="js-properties-panel" class="w-[25%] border" />

  <div class="absolute left-10 bottom-32">
    <input class="border rounded p-2" v-model="propertyValue" />
  </div>

  <button class="absolute left-10 bottom-10 z-10 px-5 py-2 bg-red-100">Export</button>
  <div class="absolute z-10 bottom-20 left-10 px-5 py-2 bg-blue-100">propertyValue: {{ propertyValue }}</div>
</template>


<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Modeler from 'bpmn-js/lib/Modeler';
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  ZeebePropertiesProviderModule
} from 'bpmn-js-properties-panel';
import ZeebeBpmnModdle from 'zeebe-bpmn-moddle/resources/zeebe.json';
import { useReactiveEventProperty } from './composable/reactive';

const wrapper = ref<HTMLDivElement>();
let modeler: unknown = null;
const initialDiagram = `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1qzjoog" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="17.11.1">
  <bpmn:process id="Process_1y563ce" isExecutable="false">
    <bpmn:startEvent id="StartEvent_0f3s7m2">
      <bpmn:outgoing>Flow_0t0xfxb</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Activity_0bry28l">
      <bpmn:incoming>Flow_0t0xfxb</bpmn:incoming>
      <bpmn:outgoing>Flow_1ggm5f1</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_0t0xfxb" sourceRef="StartEvent_0f3s7m2" targetRef="Activity_0bry28l" />
    <bpmn:endEvent id="Event_1moqpf8">
      <bpmn:incoming>Flow_1ggm5f1</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_1ggm5f1" sourceRef="Activity_0bry28l" targetRef="Event_1moqpf8" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1y563ce">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_0f3s7m2">
        <dc:Bounds x="156" y="82" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0bry28l_di" bpmnElement="Activity_0bry28l">
        <dc:Bounds x="250" y="60" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1moqpf8_di" bpmnElement="Event_1moqpf8">
        <dc:Bounds x="412" y="82" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_0t0xfxb_di" bpmnElement="Flow_0t0xfxb">
        <di:waypoint x="192" y="100" />
        <di:waypoint x="250" y="100" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1ggm5f1_di" bpmnElement="Flow_1ggm5f1">
        <di:waypoint x="350" y="100" />
        <di:waypoint x="412" y="100" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;

const propertyValue = ref('');

onMounted(() => {
  try {
    modeler = new Modeler({
      container: wrapper.value,
      propertiesPanel: {
        parent: '#js-properties-panel'
      },
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        ZeebePropertiesProviderModule
      ],
      moddleExtensions: {
        zeebe: ZeebeBpmnModdle
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (modeler as any).importXML(initialDiagram);

    const { valueRef } = useReactiveEventProperty(modeler, 'Activity_0bry28l', 'name');

    watch(() => valueRef.value, (newValue: string, _oldValue: string) => {
      propertyValue.value = newValue
    });

    watch(() => propertyValue.value, (newValue) => {
      valueRef.value = newValue;
    });

  } catch (err) {
    console.error('error loading BPMN 2.0 XML', err);
  }
});
</script>
