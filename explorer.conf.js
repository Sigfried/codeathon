
export default function explorerconf() {
  console.log('CONF');
  return {
          recs: [],
          toFetch: 'all',
          dims: [
            {field: 'data_element', name: 'Data Element' },
            {field: 'hospital_name', name: 'Hospital' },
            /*
            {field: 'issue_period', name: 'Period' },
            {field: 'measure_desc', name: 'Measure Description' },
            {field: 'measure_name', name: 'Measure Name' },
            {field: 'patient_type', name: 'Patient Type' },
            {field: 'result_name', name: 'Result Name' },
            //{field: 'result_unit', name: 'Unit' },
            //{field: 'value', name: 'Value' },
            {field: 'source_name', name: 'Source' },
            */
          ],
        };
}
