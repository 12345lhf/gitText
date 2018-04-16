using LeadingCloud.Framework.Web;
using LeadingCloud.MISPT.Framework.Common.Utils;
using LeadingCloud.MISPT.InformationRegistModel.Common.Utils;
using LeadingCloud.MISPT.InformationRegistModel.Design;
using LeadingCloud.MISPT.InformationRegistModel.Design.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace LeadingCloud.MISPT.InformationRegistModel.WebAPI.Controllers.Design
{
    public class ModelClassController : ApiController
    {

        /// <summary>
        /// 保存分类
        /// </summary>
        /// <param name="data">要保存的数据</param>
        /// <param name="sc">上下文服务</param>
        /// <returns>保存成功配置对象，否则返回null</returns>
        [Route("api/" + Const.AppCode + "/ModelClass/Add/{tokenid}")]
        [HttpPost]
        public ResponseBag<ModelClass> Save([FromBody]ModelClass model, String tokenId)
        {
            Func<StringBag, ModelClass> func = (StringBag bag) =>
            {
                return ModelClassManager.Instance.Add(model, bag.RequestContext);
            };
            return ApiControllerHelper.CallFunc<ModelClass>(func, tokenId, "328351", null);
        }

        /// <summary>
        /// 保存分类
        /// </summary>
        /// <param name="data">要保存的数据</param>
        /// <param name="sc">上下文服务</param>
        /// <returns>保存成功配置对象，否则返回null</returns>
        [Route("api/" + Const.AppCode + "/ModelClass/Update/{tokenid}")]
        [HttpPost]
        public ResponseBag<ModelClass> Update([FromBody]ModelClass model, String tokenId)
        {
            Func<StringBag, ModelClass> func = (StringBag bag) =>
            {
                return ModelClassManager.Instance.Update(model, bag.RequestContext);
            };
            return ApiControllerHelper.CallFunc<ModelClass>(func, tokenId, "328352", null);
        }

        /// <summary>
        /// 保存分类
        /// </summary>
        /// <param name="data">要保存的数据</param>
        /// <param name="sc">上下文服务</param>
        /// <returns>保存成功配置对象，否则返回null</returns>
        [Route("api/" + Const.AppCode + "/ModelClass/Delete/{id}/{tokenid}")]
        [HttpGet]
        public ResponseBag<bool> Save(string id, String tokenId)
        {
            Func<StringBag, bool> func = (StringBag bag) =>
            {
                return ModelClassManager.Instance.Delete(id, bag.RequestContext);
            };
            return ApiControllerHelper.CallFunc<bool>(func, tokenId, "328353", false);
        }

        /// <summary>
        ///  获用户取分类列表
        /// </summary>
        /// <param name="id">主键id</param>
        /// <param name="sc">上下文服务对象</param>
        /// <returns>存在返回配置对象，否则返回null</returns>
        [Route("api/" + Const.AppCode + "/ModelClass/GetList/{tokenid}")]
        [HttpGet]
        public ResponseBag<List<ModelClass>> GetControlList(String tokenId)
        {
            Func<StringBag, List<ModelClass>> func = (StringBag bag) =>
               {
                   return ModelClassManager.Instance.GetUserClassList(bag.RequestContext);
               };
            return ApiControllerHelper.CallFunc<List<ModelClass>>(func, tokenId, "328354", null);
        }


    }
}
