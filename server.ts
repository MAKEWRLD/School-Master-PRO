
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
const PORT = 3001;
const JWT_SECRET = 'schoolmaster_secret_key_2024';

app.use(cors());
app.use(express.json());

// Simulação de Banco de Dados
const users: any[] = [];
const works: any[] = [];

// Helper para encontrar utilizador
const findUserByEmail = (email: string) => users.find(u => u.email === email);

// --- ENDPOINTS ---

// Registro de Utilizador
app.post('/api/register', async (req, res) => {
  const { name, email, password, institution, course, city } = req.body;

  if (findUserByEmail(email)) {
    return res.status(400).json({ error: 'Este email já está registado.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password: hashedPassword,
      institution,
      course,
      city,
      points: 50,
      createdAt: new Date()
    };

    users.push(newUser);

    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '24h' });
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar conta.' });
  }
});

// Login de Utilizador
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
  const { password: _, ...userWithoutPassword } = user;

  res.json({ user: userWithoutPassword, token });
});

// Perfil do Utilizador (Protegido)
app.get('/api/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Não autorizado.' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.id);
    if (!user) return res.status(404).json({ error: 'Utilizador não encontrado.' });

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(401).json({ error: 'Token inválido.' });
  }
});

app.listen(PORT, () => {
  console.log(`SchoolMaster Backend rodando em http://localhost:${PORT}`);
});
