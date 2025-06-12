import { onUnmounted, ref, watch } from "vue";

export function useReactiveEventProperty(modeler: any, activityId: string, property: string) {
  const valueRef = ref('');
  const command = modeler.get('commandStack');
  const elementRegistry = modeler.get('elementRegistry');

  function getBusinessObject(element: any) {
    return (element && element.buesinessObject) || element;
  }

  const onElementChanged = (changed: any) => {
    if (changed.element.id === activityId) {
      const bo = getBusinessObject(changed.element);
      if (bo != null) {
        valueRef.value = bo.businessObject.get(property)
      }
    }
  }

  modeler.on('element.changed', onElementChanged);

  watch(() => valueRef.value, (newValue: string) => {
    const element = elementRegistry.get(activityId);
    if (element) {
      command.execute('element.updateProperties', {
        element: element,
        properties: {
          [property]: newValue
        }
      });
    } else {
      console.error(`Element with ID ${activityId} not found.`);
    }
  })

  onUnmounted(() => {
    console.log('ok we removing the change listener')
    modeler.off('element.changed', onElementChanged);
  });

  return { valueRef }
};

