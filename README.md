## Cynlang Programing Js 

## Contoh Program

File: `examples/halo.cyn`

```cyn
biarkan x = benar
biarkan y = salah

jika x dan bukan y
    tulis "Logika jalan"
selesai

fungsi faktorial(n)
    jika n == 0
        kembalikan 1
    selesai
    kembalikan n * faktorial(n - 1)
selesai

tulis tutorial(5)
```

### Output
```
true
false
Logika jalan
120
```

## Instalasi

Clone repo:
```bash
git clone https://github.com/Cynthia-cnn/CynLang.git
cd CynLang
npm install -g .
```

Jalankan `.cyn`:
```bash
cyn examples/halo.cyn
```
