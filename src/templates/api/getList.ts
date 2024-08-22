export const apiTemplateList = (name: string) => `
    import { getRepository } from 'typeorm';
    import { ${name} } from '../entity/${name}';

    export const get${name}s = async (req, res) => {
      const repository = getRepository(${name});
      const items = await repository.find();
      return res.json(items);
    };
    `
