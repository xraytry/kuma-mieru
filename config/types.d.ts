declare module '*.json' {
  const value: {
    baseUrl: string;
    htmlEndpoint: string;
    apiEndpoint: string;
  };
  export default value;
} 