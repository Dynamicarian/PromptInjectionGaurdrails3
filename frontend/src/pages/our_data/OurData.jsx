import EmbeddingViz from "./charts/attack_type_embedding";
import DataReport from "./charts/data_report";
import DonutChart from "./charts/DonutChart";

function OurData(){
    return (<div>
        <h1>Embedding Visualisation</h1>
        <EmbeddingViz />
        <DataReport /> 
        <DonutChart /> 
    </div>);  
}; 

export default OurData;