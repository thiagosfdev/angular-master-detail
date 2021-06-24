import { InMemoryDbService } from 'angular-in-memory-web-api';


class InMemoryDatabase implements InMemoryDbService {
  createDb() {
    const categories = [
      {
        id: 1,
        name: 'Moradia',
        description: 'Pagamentos de COntas da Casa'
      },
      {
        id: 2,
        name: 'Saúde',
        description: 'Planos de Saúde e Remédios'
      },
      {
        id: 3,
        name: 'Lazer',
        description: 'Cinema, parques, praia, etc'
      },
      {
        id: 4,
        name: 'Salário',
        description: 'Recebimento de Salário'
      },
      {
        id: 5,
        name: 'Freelas',
        description: 'Trabalhos como Freelancer'
      },
    ];

    return { categories };
  }
}
