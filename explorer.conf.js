
export default function explorerconf() {
  return {
          //recs: [],
          msg: 'default message',
          toFetch: 'all',
          dims: {
            all: {
              func:()=>'', field: 'all', name: 'All', hide: true,
            },
            issue_period: {
              field: 'issue_period', name: 'Period',
              sortBy: d=>d.toString(),
              role: 'x',
              dataType: 'ordinal'
            },
            element_measure: {
              field: 'element_measure', name: 'Element => Measure', 
              func: r=>r.data_element + ' => ' + r.measure_name,
              chart: true,
            },
            patient_type: {field: 'patient_type', name: 'Patient Type' },
            result_name: {field: 'result_name', name: 'Result Name' },
            hospital_name: {field: 'hospital_name', name: 'Hospital' },
            result_unit: {field: 'result_unit', name: 'Unit' },
            /*
            value: {field: 'value', name: 'Value' },

            data_element: {field: 'data_element', name: 'Data Element' },
            {field: 'measure_desc', name: 'Measure Description' },
            {field: 'measure_name', name: 'Measure Name' },
            source_name: {field: 'source_name', name: 'Source' },

            */
          },
        };
}
