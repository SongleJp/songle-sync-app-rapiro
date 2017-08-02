# Songle Sync Rapiro向けslaveプロジェクト

## 初期設定

Raspberry Piの設定画面からホスト名を変えたりシリアルポートを有効にしたりします。シリアルポートは有効にするがログインシェルとしては使わない設定が必要です。

```sh
sudo raspi-config
```

5インチLCDディスプレイをつないだ場合はドライバをインストールする必要もあります。

```sh
git clone https://github.com/goodtft/LCD-show.git
chmod -R 755 LCD-show
cd LCD-show/
```

Node.jsをインストールするには以下を実行します。

```sh
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt install nodejs
```

## 静的IPを設定する方法

`/etc/network/interfaces.d/eth0` を作成し、以下のような内容にします。

```sh
auto eth0
allow-hotplug eth0
iface eth0 inet static
address 192.168.3.107
netmask 255.255.0.0
gateway 192.168.1.1
dns-nameservers 8.8.8.8 8.8.4.4
```

これでだめな場合は `/etc/dhcpcd.conf` の末尾に以下の記述を足します。

```sh
interface eth0
static ip_address=192.168.3.106/16
static routers=192.168.1.1
static domain_name_servers=8.8.8.8 8.8.4.4
```

## 一般的な使い方説明

以下のようにして実行してください。 `npm install` は最初の一度だけ必要です。

```sh
npm install
node index.js
```

`npm install` のときに `serialport` モジュールのビルドで失敗するときは以下のコマンドでビルドし直してください。

```sh
sudo npm uninstall serialport
sudo npm install serialport --unsafe-perm --build-from-source
```

## Rapiroの接続チェック

`npm install` のあとに以下のコマンドを実行してください。Rapiroが右手を振れば成功です。

```sh
node rapiro-test.js
```
