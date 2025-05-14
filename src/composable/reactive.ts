import { ref, watch } from "vue";

export function useReactiveEventProperty(modeler: any, activityId: string, property: string) {
  const valueRef = ref('');
  const command = modeler.get('commandStack');
  const elementRegistry = modeler.get('elementRegistry');

  function getBusinessObject(element: any) {
    return (element && element.buesinessObject) || element;
  }

  modeler.on('element.changed', (_changed: any) => {
    if (_changed.element.id === activityId) {
      const bo = getBusinessObject(_changed.element);

      if (bo != null) {
        valueRef.value = bo.businessObject.get(property)
      }
    }
  })

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

  return { valueRef }
};

