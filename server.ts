
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

// Registro de Utilizador com Verificação de Email
app.post('/api/register', async (req, res) => {
  const { name, email, password, institution, course, city } = req.body;

  if (findUserByEmail(email)) {
    return res.status(400).json({ error: 'Este email já está registado.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.random().toString(36).substr(2, 12).toUpperCase();
    
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password: hashedPassword,
      institution,
      course,
      city,
      points: 50,
      isVerified: false,
      verificationToken,
      createdAt: new Date()
    };

    users.push(newUser);

    // SIMULAÇÃO DE ENVIO DE EMAIL
    console.log('---------------------------------------------------------');
    console.log(`[EMAIL SIMULADO] Para: ${email}`);
    console.log(`Assunto: Verifique sua conta SchoolMaster PRO`);
    console.log(`Código de Verificação: ${verificationToken}`);
    console.log(`Link: http://localhost:3000/#/verify/${verificationToken}`);
    console.log('---------------------------------------------------------');

    res.status(201).json({ message: 'Registo realizado. Verifique o seu email.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar conta.' });
  }
});

// Verificação de Email
app.post('/api/verify-email', (req, res) => {
  const { token } = req.body;
  const user = users.find(u => u.verificationToken === token);

  if (!user) {
    return res.status(400).json({ error: 'Token de verificação inválido ou expirado.' });
  }

  user.isVerified = true;
  user.verificationToken = null; // Limpa o token após uso

  res.json({ message: 'Conta verificada com sucesso! Já pode fazer login.' });
});

// Login com Verificação
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }

  if (!user.isVerified) {
    return res.status(403).json({ error: 'Sua conta ainda não foi verificada. Verifique o seu email.' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '24h' });
  const { password: _, verificationToken: __, ...userWithoutPassword } = user;

  res.json({ user: userWithoutPassword, token });
});

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
