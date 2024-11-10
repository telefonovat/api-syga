import { Collection } from 'mongodb';
import { Database } from '../src/services/database/Database';
import { AlgorithmRetriever } from '../src/services/database/algorithm-retriever';

import util from 'util';

describe('Algorithm Retriever', () => {
  let database: jest.Mocked<Database>;
  let algorithmRetriever: AlgorithmRetriever;

  const mockRetrievalInfo = {
    slug: 'hello-world',
    version: 'latest',
    namespace: 'test',
  };

  const mockAlgorithm = {
    _id: '67100ea137bae8743efe145e',
    slug: 'hello-world',
    version: 'latest',
    namespace: 'test',
    code: "print('Hello World')",
  };

  beforeEach(() => {
    database = {
      getCollection: jest.fn(),
    } as unknown as jest.Mocked<Database>;

    algorithmRetriever = new AlgorithmRetriever(database);
  });

  it('Retrieve an algorithm if it exists', async () => {
    const mockCollection = {
      findOne: jest.fn().mockResolvedValue(mockAlgorithm),
    } as unknown as Collection<Document>;
    database.getCollection.mockReturnValue(mockCollection);
    const result =
      await algorithmRetriever.retrieveOne(mockRetrievalInfo);
    expect(result).toEqual(mockAlgorithm);
    expect(database.getCollection).toHaveBeenCalledWith('algorithms');
    expect(mockCollection.findOne).toHaveBeenCalledWith(
      mockRetrievalInfo,
    );
  });
  it('Throw an error when algorithm is not found', async () => {
    const mockCollection = {
      findOne: jest.fn().mockResolvedValue(null),
    } as unknown as Collection<Document>;
    database.getCollection.mockReturnValue(mockCollection);

    await expect(
      algorithmRetriever.retrieveOne(mockRetrievalInfo),
    ).rejects.toThrow(
      `Algorithm not found : ${util.inspect(mockRetrievalInfo)}`,
    );

    expect(database.getCollection).toHaveBeenCalledWith('algorithms');
    expect(mockCollection.findOne).toHaveBeenCalledWith(
      mockRetrievalInfo,
    );
  });
});
