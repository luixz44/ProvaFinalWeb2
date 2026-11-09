import { Routes, Route } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import Header from "./components/Header";
import Catalogo from "./pages/Catalogo";
import Carrinho from "./pages/Carrinho";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const PRODUTOS_INICIAIS = [
  { id: 1, nome: "Caneca de cerâmica", preco: 39.9, descricao: "350 ml, vai ao micro-ondas." },
  { id: 2, nome: "Caderno pautado", preco: 24.5, descricao: "96 folhas, capa dura." },
  { id: 3, nome: "Mochila urbana", preco: 189.0, descricao: "Cabe notebook de 15 polegadas." },
];

export default function App() {

  const [produtos, setProdutos] = useLocalStorage("produtos", PRODUTOS_INICIAIS);

  const [carrinho, setCarrinho] = useLocalStorage("carrinho", []);

  function salvarProduto(dados) {
    if (dados.id) {
  
      setProdutos(produtos.map((p) => (p.id === dados.id ? dados : p)));
    } else {
     
      setProdutos([...produtos, { ...dados, id: Date.now() }]);
    }
  }

  function removerProduto(id) {
   
    setProdutos(produtos.filter((p) => p.id !== id));
    setCarrinho(carrinho.filter((item) => item.id !== id));
  }

  function adicionarAoCarrinho(id) {
    const jaTem = carrinho.find((item) => item.id === id);
    if (jaTem) {
      setCarrinho(carrinho.map((item) => (item.id === id ? { ...item, qtd: item.qtd + 1 } : item)));
    } else {
      setCarrinho([...carrinho, { id, qtd: 1 }]);
    }
  }

  function mudarQuantidade(id, mudanca) {
    setCarrinho(
      carrinho
        .map((item) => (item.id === id ? { ...item, qtd: item.qtd + mudanca } : item))
        .filter((item) => item.qtd > 0)
    );
  }

  function removerDoCarrinho(id) {
    setCarrinho(carrinho.filter((item) => item.id !== id));
  }

  const totalItens = carrinho.reduce((soma, item) => soma + item.qtd, 0);

  return (
    <>
      <Header totalItens={totalItens} />
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
        <Routes>
          <Route path="/" element={<Catalogo produtos={produtos} onAdicionar={adicionarAoCarrinho} />} />
          <Route
            path="/carrinho"
            element={
              <Carrinho
                produtos={produtos}
                carrinho={carrinho}
                onMudarQtd={mudarQuantidade}
                onRemover={removerDoCarrinho}
                onLimpar={() => setCarrinho([])}
              />
            }
          />
          <Route
            path="/admin"
            element={<Admin produtos={produtos} onSalvar={salvarProduto} onRemover={removerProduto} />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
