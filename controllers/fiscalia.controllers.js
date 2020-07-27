const { getActividades } = require('../services/fiscalias/fiscalias.services')

exports.getFiscalias = async function (req, res, next) {
  
    const actividad = await getActividades(req.body);
  
    if (actividad) {
      return res.status(200).send({
        valid: true,
        msg: 'Listado de fiscalias',
        data: actividad.data
      });
    }
    res
      .status(200)
      .send({
        valid: false,
        msg: "Query Error",
        data: actividad
      });
  };