
export default function explorerconf() {
  return {
          //recs: [],
          toFetch: 'all',
          dims: {
            element_measure: {field: 'element_measure', name: 'Element/Measure', 
              func: r=>r.data_element + ' => ' + r.measure_name},
            //data_element: {field: 'data_element', name: 'Data Element' },
            //patient_type: {field: 'patient_type', name: 'Patient Type' },
            /*
            hospital_name: {field: 'hospital_name', name: 'Hospital' },
            {field: 'issue_period', name: 'Period' },
            {field: 'measure_desc', name: 'Measure Description' },
            {field: 'measure_name', name: 'Measure Name' },
            {field: 'result_name', name: 'Result Name' },
            //{field: 'result_unit', name: 'Unit' },
            //{field: 'value', name: 'Value' },
            {field: 'source_name', name: 'Source' },
            */
          },
        };
}
