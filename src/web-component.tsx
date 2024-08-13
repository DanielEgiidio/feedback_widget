import ReactDOM from "react-dom/client";
import Widget from "./components/Widget";

// Função para normalizar os atributos do HTML para props no React
export const normalizeAttribute = (attribute: string): string => {
  return attribute.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};

// Classe para o Web Component
class WidgetWebComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  // Método chamado quando o componente é adicionado ao DOM
  connectedCallback() {
    const props = this.getPropsFromAttributes();
    const root = ReactDOM.createRoot(this.shadowRoot as ShadowRoot);
    root.render(<Widget {...props} />);
  }

  // Método para obter os props a partir dos atributos do HTML
  getPropsFromAttributes(): Record<string, any> {
    const props: Record<string, any> = {};
    for (const { name, value } of Array.from(this.attributes)) {
      props[normalizeAttribute(name)] = value;
    }
    return props;
  }
}

// Exporta o Web Component como padrão
export default WidgetWebComponent;
