export const apiTemplateDelete = (name: string) => `
    import { getRepository } from 'typeorm';
    import { ${name} } from '../entity/${name}';

    export const delete${name} = async (req, res) => {
      const repository = getRepository(${name});
      const id = req.params.id;
      const item = await repository.findOne(id);

      if (!item) {
        return res.status(404).json({ message: '${name} not found' });
      }

      await repository.remove(item);
      return res.status(204).send();
    };
    `
