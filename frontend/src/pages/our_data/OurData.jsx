import EmbeddingViz from "./charts/attack_type_embedding";
import DataReport from "./charts/data_report";
import DonutChart from "./charts/DonutChart";
import ThresholdChart from "./charts/Threshold";

function OurData(){
    return (<div>

        <DataReport /> 
        <DonutChart /> 
        <ThresholdChart />         
        <h1>Embedding Visualisation</h1>
        <EmbeddingViz />
    </div>);  
}; 

export default OurData;