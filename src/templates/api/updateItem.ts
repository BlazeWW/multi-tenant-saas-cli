export const apiTemplateUpdate = (name: string) => `
    import { getRepository } from 'typeorm';
    import { ${name} } from '../entity/${name}';

    export const update${name} = async (req, res) => {
      const repository = getRepository(${name});
      const id = req.params.id;
      let item = await repository.findOne(id);

      if (!item) {
        return res.status(404).json({ message: '${name} not found' });
      }

      repository.merge(item, req.body);
      await repository.save(item);
      return res.json(item);
    };
    `
