
export default function explorerconf() {
  return {
          //recs: [],
          msg: 'default message',
          //schema: 'pcornet_dq',
          schema: 'phis_dq',
          //schema: 'chco_dq',
          toFetch: 'all',
          //toFetch: 'dimsetsets',
          //allDims: true,
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
            data_element: {field: 'data_element', name: 'Data Element' },
            patient_type: {field: 'patient_type', name: 'Patient Type' },
            result_name: {field: 'result_name', name: 'Result Name' },
            hospital_name: {field: 'hospital_name', name: 'Hospital' },
            result_unit: {field: 'result_unit', name: 'Unit' },
            measure_name: {canAggregate: false, field: 'measure_name', 
              name: 'Measure Name', chart:true },
            /*
            element_measure: {
              field: 'element_measure', name: 'Element => Measure', 
              func: r=>r.data_element + ' => ' + r.measure_name,
              chart: true,
            },
            */
            /*
            value: {field: 'value', name: 'Value' },

            {field: 'measure_desc', name: 'Measure Description' },
            source_name: {field: 'source_name', name: 'Source' },

            */
          },
        };
}
