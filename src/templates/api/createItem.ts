export const apiTemplateCreate = (name: string) => `
    import { getRepository } from 'typeorm';
    import { ${name} } from '../entity/${name}';

    export const create${name} = async (req, res) => {
      const repository = getRepository(${name});
      const newItem = repository.create(req.body);
      await repository.save(newItem);
      return res.status(201).json(newItem);
    };
    `
