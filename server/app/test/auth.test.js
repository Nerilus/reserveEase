const request = require('supertest');
const { app, sequelize } = require('../main');

describe('Auth API', () => {
    beforeEach(async () => {
      // Nettoyer la base de données avant chaque test
      await sequelize.query('DELETE FROM Users');
    });
  
    afterEach(async () => {
      // Code pour nettoyer ou restaurer l'état de la base de données après chaque test
    });
  
    it('POST /api/auth/register - should register a new user', async () => {
      const userData = {
        username: 'Benjamin',
        email: 'Benjamin.h@gmail.com',
        password: 'benjamin',
        country: 'CountryName',
        city: 'CityName',
        phone: '123456789'
      };
  
      const res = await request(app)
        .post('/api/auth/register')
        .send(userData);
  
      expect(res.statusCode).toEqual(201); // Attend un code 201 pour la création
      expect(res.body).toHaveProperty('username', 'Benjamin');
      expect(res.body).toHaveProperty('email', 'Benjamin.h@gmail.com');
      // Assurez-vous que d'autres propriétés nécessaires sont correctement retournées dans le corps de la réponse
    });
  });