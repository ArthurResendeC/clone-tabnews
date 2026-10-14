import useSWR from "swr";

async function featchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status Page</h1>
      <UpdatedAt />
      <Database />
    </>
  );
}

function UpdatedAt() {
  const { data, isLoading } = useSWR("/api/v1/status", featchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";
  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }
  return <div>Última atualização: {updatedAtText}</div>;
}

function Database() {
  const { data, isError, isLoading } = useSWR("/api/v1/status", featchAPI, {
    refreshInterval: 2000,
  });
  return (
    <div>
      <h2>Database:</h2>
      {isError && <p>Erro ao carregar dados</p>}
      {isLoading && <p>Carregando...</p>}
      <div>Version: {data?.dependencies?.database?.version}</div>
      <div>
        Conexões abertas: {data?.dependencies?.database?.opened_connections}
      </div>
      <div>
        Máximo de conexões: {data?.dependencies?.database?.max_connections}
      </div>
    </div>
  );
}
