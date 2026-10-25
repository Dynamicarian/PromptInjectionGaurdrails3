import EmbeddingViz from "./charts/attack_type_embedding";
import DonutChart from "./charts/DonutChart";
import ThresholdChart from "./charts/Threshold";

function OurData(){
    return (<div>
        <h1 id="data_heading">Data Used to Train the Model</h1>
        <DonutChart /> 
        <h1 id="data_heading">Model Metrics</h1>
        <ThresholdChart />         
        <h1 id="data_heading">Attack Type Data Embedding Visualisation 3D</h1>
        <EmbeddingViz />
    </div>);  
}; 

export default OurData;