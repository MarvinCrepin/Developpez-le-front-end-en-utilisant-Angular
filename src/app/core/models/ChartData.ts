interface ChartData {
    labels: string[]|number[];
    datasets: Dataset[];
  }
  
  interface Dataset {
    data: number[];
    backgroundColor: string[];
  }

  export {ChartData, Dataset}