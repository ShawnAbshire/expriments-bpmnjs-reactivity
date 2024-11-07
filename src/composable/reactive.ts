import { ref } from "vue";

export function useReactiveEventProperty(modeler: any, activityId: string, property: string) {
  const valueRef = ref('');

  function getBusinessObject(element: any) {
    return (element && element.buesinessObject) || element;
  }

  modeler.on('element.changed', (_changed: any) => {
    if (_changed.element.id === activityId) {
      const bo = getBusinessObject(_changed.element);

      if (bo != null) {
        valueRef.value = bo.businessObject.get(property)
        console.log('valueRef', valueRef.value);
      }
    }
  })


  return { valueRef }
};

