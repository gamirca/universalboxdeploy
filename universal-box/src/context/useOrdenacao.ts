import { useState, useMemo } from 'react';

interface ConfiguracaoOrdenacao<T> {
  chave: keyof T;
  direcao: 'ascendente' | 'descendente';
}

export function useOrdenacao<T>(itens: T[]) {
  const [configuracaoOrdenacao, setConfiguracaoOrdenacao] = useState<ConfiguracaoOrdenacao<T> | null>(null);

  const itensOrdenados = useMemo(() => {
    let itensOrdenaveis = [...itens];
    if (configuracaoOrdenacao !== null) {
      itensOrdenaveis.sort((a, b) => {
        if (a[configuracaoOrdenacao.chave] < b[configuracaoOrdenacao.chave]) {
          return configuracaoOrdenacao.direcao === 'ascendente' ? -1 : 1;
        }
        if (a[configuracaoOrdenacao.chave] > b[configuracaoOrdenacao.chave]) {
          return configuracaoOrdenacao.direcao === 'ascendente' ? 1 : -1;
        }
        return 0;
      });
    }
    return itensOrdenaveis;
  }, [itens, configuracaoOrdenacao]);

  const solicitarOrdenacao = (chave: keyof T) => {
    let direcao: 'ascendente' | 'descendente' = 'ascendente';
    if (configuracaoOrdenacao && configuracaoOrdenacao.chave === chave && configuracaoOrdenacao.direcao === 'ascendente') {
      direcao = 'descendente';
    }
    setConfiguracaoOrdenacao({ chave, direcao });
  };

  const obterClassNamesPara = (chave: keyof T) => {
    if (!configuracaoOrdenacao) {
      return;
    }
    return configuracaoOrdenacao.chave === chave ? configuracaoOrdenacao.direcao : undefined;
  };

  return { itens: itensOrdenados, solicitarOrdenacao, configuracaoOrdenacao, obterClassNamesPara };
}
