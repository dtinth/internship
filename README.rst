internship
==========

Legacy project by SKE09 for Seminar course.


Development
-----------


Frontend
~~~~~~~~

Please install Node.js. Then install Harp and daproxy_::

  npm install -g harp daproxy

.. _daproxy: https://www.npmjs.com/package/daproxy

To run frontend server::

  harp server

The frontend will be accessible at ``http://localhost:9000/``.

To connect to backend, there are 2 options.

1. Simply connect to the Backend_.
2. Set up a proxy to the production Backend server::

      proxy -p 8001 -t 'http://ASK_FOR_IP_ADDERSS_FROM_CHANON:8001/'

Backend
~~~~~~~

Please install Vagrant and VirtualBox. If you are rich, please install Parallels and Parallels plugin for Vagrant.

Then use the following command to set up the server development environment (io.js + MySQL)::

  vagrant up

After that, SSH into the VM::

  vagrant ssh

Install dependencies and migrate the database::

  sudo npm install -g knex
  cd /vagrant
  npm install
  knex migrate:latest

To start server, run this command::

  iojs server

The server will be accessible at ``http://localhost:8001``.


